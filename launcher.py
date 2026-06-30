import os
import sys
import subprocess
import threading
import time
import webbrowser
import signal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

processes = []


def log(msg):
    print(f"[SignSpeak AI] {msg}")


def run_command(cmd, cwd, label):
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            shell=True,
            text=True,
        )
        processes.append(proc)
        for line in iter(proc.stdout.readline, ""):
            print(f"[{label}] {line}", end="")
        proc.wait()
    except Exception as e:
        log(f"{label} error: {e}")


def install_backend_deps():
    log("Installing backend dependencies...")
    req = os.path.join(BACKEND_DIR, "requirements.txt")
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "-q", "-r", req],
        cwd=BACKEND_DIR,
    )


def install_frontend_deps():
    if not os.path.isdir(os.path.join(FRONTEND_DIR, "node_modules")):
        log("Installing frontend dependencies...")
        subprocess.run("npm install", cwd=FRONTEND_DIR, shell=True)


def start_backend():
    log("Starting backend on http://localhost:8000 ...")
    run_command(
        f"{sys.executable} -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload",
        BACKEND_DIR,
        "Backend",
    )


def start_frontend():
    log("Starting frontend on http://localhost:3000 ...")
    run_command("npx vite --host 0.0.0.0 --port 3000", FRONTEND_DIR, "Frontend")


def open_browser():
    time.sleep(4)
    url = "http://localhost:3000"
    log(f"Opening browser at {url}")
    webbrowser.open(url)


def cleanup(*_):
    log("Shutting down...")
    for proc in processes:
        try:
            proc.terminate()
        except Exception:
            pass
    sys.exit(0)


def main():
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print("=" * 50)
    print("  SignSpeak AI — Real-Time Sign Language Translator")
    print("=" * 50)
    print()

    install_backend_deps()
    install_frontend_deps()

    backend_thread = threading.Thread(target=start_backend, daemon=True)
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    browser_thread = threading.Thread(target=open_browser, daemon=True)

    backend_thread.start()
    frontend_thread.start()
    browser_thread.start()

    print()
    print("=" * 50)
    print("  Frontend: http://localhost:3000")
    print("  Backend:  http://localhost:8000")
    print("  API Docs: http://localhost:8000/docs")
    print("=" * 50)
    print()
    print("Press Ctrl+C to stop.")
    print()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()

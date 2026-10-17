using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Text.RegularExpressions;
using System.Threading;

class Program
{
    private static Process serverProcess = null;

    static void Main(string[] args)
    {
        Console.Title = "VoxAI English Learning Platform - Runner";
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("==================================================================");
        Console.WriteLine("       VoxAI - Next-Gen AI English Learning SaaS Platform         ");
        Console.WriteLine("==================================================================");
        Console.ResetColor();

        string projectDir = @"c:\Users\NV THANH\OneDrive\Documents\Project\English";
        string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string nodeDir = Path.Combine(localAppData, @"Programs\nodejs");

        // Ensure Node.js is in PATH
        string currentPath = Environment.GetEnvironmentVariable("PATH") ?? "";
        if (!currentPath.Contains(nodeDir) && Directory.Exists(nodeDir))
        {
            Environment.SetEnvironmentVariable("PATH", nodeDir + ";" + currentPath);
        }

        // Detect first available port starting from 3000
        int targetPort = 3000;
        while (IsPortInUse(targetPort) && targetPort < 3100)
        {
            targetPort++;
        }

        if (targetPort != 3000)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("[!] Cảnh báo: Port 3000 đang được dùng bởi ứng dụng khác (Docker/WSL/System).");
            Console.WriteLine("[+] Tự động chuyển cổng hoạt động sang: http://localhost:" + targetPort);
            Console.ResetColor();
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("[+] Cổng hoạt động khả dụng: http://localhost:3000");
            Console.ResetColor();
        }

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("[*] Đang khởi động VoxAI Next.js App trên port " + targetPort + " ...");
        Console.ResetColor();

        bool browserOpened = false;
        string launchedUrl = "http://localhost:" + targetPort;

        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = string.Format("/c npx next dev -p {0}", targetPort),
            WorkingDirectory = projectDir,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = false
        };

        psi.EnvironmentVariables["PORT"] = targetPort.ToString();
        psi.EnvironmentVariables["AUTH_TRUST_HOST"] = "true";

        // Handle process exit cleanly
        AppDomain.CurrentDomain.ProcessExit += (s, e) => KillChildProcess();
        Console.CancelKeyPress += (s, e) =>
        {
            KillChildProcess();
            Environment.Exit(0);
        };

        try
        {
            serverProcess = new Process { StartInfo = psi };

            serverProcess.OutputDataReceived += (sender, e) =>
            {
                if (string.IsNullOrEmpty(e.Data)) return;

                Console.WriteLine(e.Data);

                // Detect actual URL from Next.js output
                Match match = Regex.Match(e.Data, @"Local:\s*(https?://[^\s]+)");
                if (match.Success)
                {
                    launchedUrl = match.Groups[1].Value.Trim();
                    OpenBrowserOnce(launchedUrl, ref browserOpened);
                }
                else if ((e.Data.Contains("Ready in") || e.Data.Contains("started server")) && !browserOpened)
                {
                    OpenBrowserOnce(launchedUrl, ref browserOpened);
                }
            };

            serverProcess.ErrorDataReceived += (sender, e) =>
            {
                if (string.IsNullOrEmpty(e.Data)) return;
                Console.ForegroundColor = ConsoleColor.DarkGray;
                Console.WriteLine(e.Data);
                Console.ResetColor();
            };

            serverProcess.Start();
            serverProcess.BeginOutputReadLine();
            serverProcess.BeginErrorReadLine();

            // Safety timer: if not opened after 4 seconds, open targetPort
            Thread timerThread = new Thread(() =>
            {
                Thread.Sleep(4500);
                OpenBrowserOnce(launchedUrl, ref browserOpened);
            });
            timerThread.IsBackground = true;
            timerThread.Start();

            serverProcess.WaitForExit();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("[!] Lỗi khi chạy ứng dụng: " + ex.Message);
            Console.ResetColor();
            Console.ReadLine();
        }
    }

    private static void OpenBrowserOnce(string url, ref bool browserOpened)
    {
        if (browserOpened) return;
        browserOpened = true;

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine();
        Console.WriteLine("==================================================================");
        Console.WriteLine(" [✓] Ứng dụng đã sẵn sàng! Đang mở trình duyệt tới: " + url);
        Console.WriteLine(" [i] Để học, hãy giữ cửa sổ này. Muốn dừng app, hãy đóng cửa sổ này.");
        Console.WriteLine("==================================================================");
        Console.ResetColor();

        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch { }
    }

    private static bool IsPortInUse(int port)
    {
        try
        {
            IPGlobalProperties ipProperties = IPGlobalProperties.GetIPGlobalProperties();
            IPEndPoint[] tcpEndPoints = ipProperties.GetActiveTcpListeners();
            foreach (IPEndPoint ep in tcpEndPoints)
            {
                if (ep.Port == port) return true;
            }

            TcpConnectionInformation[] tcpConnections = ipProperties.GetActiveTcpConnections();
            foreach (TcpConnectionInformation conn in tcpConnections)
            {
                if (conn.LocalEndPoint.Port == port && conn.State != TcpState.Closed)
                {
                    return true;
                }
            }
        }
        catch { }
        return false;
    }

    private static void KillChildProcess()
    {
        try
        {
            if (serverProcess != null && !serverProcess.HasExited)
            {
                serverProcess.Kill();
            }
        }
        catch { }
    }
}

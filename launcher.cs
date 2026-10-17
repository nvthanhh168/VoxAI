using System;
using System.Diagnostics;
using System.IO;
using System.Threading;

class Program
{
    static void Main(string[] args)
    {
        Console.Title = "VoxAI English Learning SaaS - Runner";
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
        if (!currentPath.Contains(nodeDir))
        {
            Environment.SetEnvironmentVariable("PATH", nodeDir + ";" + currentPath);
        }

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("[*] Starting VoxAI Next.js Web Application on http://localhost:3000 ...");
        Console.ResetColor();

        // Start npm run dev process
        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = "/c npm run dev",
            WorkingDirectory = projectDir,
            UseShellExecute = false,
            CreateNoWindow = false
        };

        Process serverProcess = null;
        try
        {
            serverProcess = Process.Start(psi);
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("[!] Error starting server: " + ex.Message);
            Console.ReadLine();
            return;
        }

        // Wait a few seconds for server initialization, then open browser
        Thread.Sleep(3000);
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("[+] Server started! Opening web browser to http://localhost:3000 ...");
        Console.ResetColor();

        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = "http://localhost:3000",
                UseShellExecute = true
            });
        }
        catch { }

        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.White;
        Console.WriteLine(">> Web app is live at http://localhost:3000");
        Console.WriteLine(">> Leave this window open while studying. Close this window to stop.");
        Console.ResetColor();

        if (serverProcess != null)
        {
            serverProcess.WaitForExit();
        }
    }
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SetupPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const credentials = [
    {
      key: "VITE_FIREBASE_API_KEY",
      description: "Firebase API Key from your project settings",
    },
    {
      key: "VITE_FIREBASE_PROJECT_ID",
      description: "Your Firebase Project ID",
    },
    {
      key: "VITE_FIREBASE_APP_ID",
      description: "Firebase App ID from web app config",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied!",
      description: "Environment variable name copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <CardTitle>Firebase Configuration Required</CardTitle>
          </div>
          <CardDescription>
            Your Invoice Generator needs Firebase credentials to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Follow these steps to set up your Firebase project:
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-primary min-w-fit">Step 1:</span>
                <span>
                  Visit{" "}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Firebase Console
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary min-w-fit">Step 2:</span>
                <span>Open your project and click the gear icon → "Project settings"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary min-w-fit">Step 3:</span>
                <span>Under "Your apps", find your web app configuration</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary min-w-fit">Step 4:</span>
                <span>Copy the values below and add them to your environment secrets</span>
              </li>
            </ol>
          </div>

          <div className="space-y-3 border-t pt-6">
            <p className="text-sm font-medium">Environment Variables to Add:</p>
            <div className="space-y-2">
              {credentials.map((cred) => (
                <div
                  key={cred.key}
                  className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm break-all">{cred.key}</p>
                    <p className="text-xs text-muted-foreground">{cred.description}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(cred.key)}
                    className="flex-shrink-0"
                    data-testid={`button-copy-${cred.key}`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Once you've added these credentials:
            </p>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              <li>Refresh this page or restart the application</li>
              <li>Google Sign-in will be available</li>
              <li>Your data will sync in real-time with Firebase Firestore</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm">
            <p className="text-blue-900 dark:text-blue-200">
              💡 <strong>Tip:</strong> You can also set these in your Replit secrets tab for
              security!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

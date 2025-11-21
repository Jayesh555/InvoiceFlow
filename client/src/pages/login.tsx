import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  isLoading?: boolean;
}

export default function LoginPage({ onLogin, isLoading }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Invoice Generator</CardTitle>
          <CardDescription className="text-base">
            Professional medical billing system for managing clients, doctors, and invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={onLogin}
            disabled={isLoading}
            data-testid="button-login-google"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Secure authentication powered by Firebase
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

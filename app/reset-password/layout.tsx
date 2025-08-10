import AppProviders from "@/store/provider";
export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
    return (
      <AppProviders>
        {children}
      </AppProviders>
    );
  }
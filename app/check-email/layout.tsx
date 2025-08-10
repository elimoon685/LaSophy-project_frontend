import AppProviders from "@/store/provider";
export default function CheckEmailLayout({ children }: { children: React.ReactNode }) {
    return (
      <AppProviders>
        {children}
      </AppProviders>
    );
  }
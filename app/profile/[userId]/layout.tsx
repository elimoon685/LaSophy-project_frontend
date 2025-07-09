
import AppProviders from "@/store/provider";
export default function ProfileLayout({ children, modal }: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }) {
    return (
      <AppProviders>
        {children} {/* Main profile page */}
        {modal}     {/* Modal overlay */}
      </AppProviders>
    );
  }
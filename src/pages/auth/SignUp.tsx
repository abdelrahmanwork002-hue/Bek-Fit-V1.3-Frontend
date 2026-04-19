import { SignUp } from "@clerk/clerk-react";
import { Activity } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
          <Activity className="size-8 text-primary" />
        </div>
        <div className="text-3xl font-black text-white italic tracking-tighter uppercase">BekFit</div>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl",
            headerTitle: "text-white font-black italic uppercase tracking-tighter text-2xl",
            headerSubtitle: "text-muted-foreground font-medium",
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-12",
            formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-muted-foreground",
            formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary",
            footerActionLink: "text-primary hover:text-primary/80 font-bold",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-primary",
            dividerLine: "bg-white/5",
            dividerText: "text-muted-foreground text-[10px] font-black uppercase tracking-widest"
          }
        }}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
}

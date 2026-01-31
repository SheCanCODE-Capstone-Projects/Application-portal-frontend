import LoginForm from "@/components/auth/LoginForm";
import {AuroraBackground} from "@/components/background/page";

export default function LoginPage() {

  return (
          <>
              <AuroraBackground className="px-3 sm:px-4">
                  <LoginForm  />
              </AuroraBackground>
          </>
      )


}


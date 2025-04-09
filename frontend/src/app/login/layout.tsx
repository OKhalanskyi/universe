import React, {PropsWithChildren} from 'react';
import {AuthLayout} from "@/modules/auth";

const LoginLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
};

export default LoginLayout;
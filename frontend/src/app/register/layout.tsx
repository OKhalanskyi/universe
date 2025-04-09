import React, { PropsWithChildren } from 'react';
import { AuthLayout } from '@/modules/auth/ui/auth-layout';

const RegisterLayout = ({ children }: PropsWithChildren) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default RegisterLayout;

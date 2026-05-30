import { parishCircularLogo, parishHorizontalLogo, parishVerticalLogo } from '@/assets/logos';

export default function Logo({ variant = 'horizontal', className = '' }) {
  const src = variant === 'vertical' ? parishVerticalLogo : variant === 'circular' ? parishCircularLogo : parishHorizontalLogo;

  return <img className={`brand-logo brand-logo-${variant} ${className}`.trim()} src={src} alt="Paróquia Nossa Senhora das Graças" />;
}
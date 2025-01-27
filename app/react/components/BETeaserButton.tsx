import { ReactNode } from 'react';

import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { Button } from '@@/buttons';
import { TooltipWithChildren } from '@@/Tip/TooltipWithChildren';

interface Props {
  featureId: FeatureId;
  heading: string;
  message: string;
  buttonText: string;
  className?: string;
  icon?: ReactNode;
}

export function BETeaserButton({
  featureId,
  heading,
  message,
  buttonText,
  className,
  icon,
}: Props) {
  return (
    <TooltipWithChildren
      className={className}
      heading={heading}
      BEFeatureID={featureId}
      message={message}
    >
      <span>
        <Button
          icon={icon}
          type="button"
          color="warninglight"
          size="small"
          onClick={() => {}}
          disabled
        >
          {buttonText}
        </Button>
      </span>
    </TooltipWithChildren>
  );
}

import React from 'react';
import { templates } from 'core/js/reactHelpers';

export default function AvatarController(props) {

  const { avatarPose } = props;

  return (

    <templates.image {...avatarPose._graphic}
      classNamePrefixes={['avatarcontroller-pose']}
      attributionClassNamePrefixes={['avatarcontroller', 'avatar']}
    />

  );
}

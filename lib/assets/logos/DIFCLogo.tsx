
'use client'

import * as React from 'react'

export function DIFCLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="130"
      height="40"
      viewBox="0 0 130 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <path d="M0 0H130V40H0V0Z" fill="url(#pattern0_197_86)" />
      <defs>
        <pattern
          id="pattern0_197_86"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_197_86"
            transform="scale(0.00769231 0.025)"
          />
        </pattern>
        <image
          id="image0_197_86"
          width="130"
          height="40"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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
        "
        />
      </defs>
    </svg>
  )
}
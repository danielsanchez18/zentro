import type { ComponentType, SVGProps } from "react";

/**
 * Íconos propios del Hub.
 * Para agregar uno: copia el <svg>, quita width/height, usa `currentColor`
 * en fill/stroke y deja `{...props}` para que reciba el className.
 */
export type HubIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.30em"
    height="1.30em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 11.99v2.51c0 3.3 0 4.95 1.025 5.975S6.7 21.5 10 21.5h4c3.3 0 4.95 0 5.975-1.025S21 17.8 21 14.5v-2.51c0-1.682 0-2.522-.356-3.25s-1.02-1.244-2.346-2.276l-2-1.555C14.233 3.303 13.2 2.5 12 2.5s-2.233.803-4.298 2.409l-2 1.555C4.375 7.496 3.712 8.012 3.356 8.74S3 10.308 3 11.99M16 17H8"
    />
  </svg>
);

export const CompanyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.30em"
    height="1.30em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.111 13.255c.185-.17.277-.255.389-.255s.204.085.389.255l.713.657c.086.079.129.119.182.138c.054.02.112.018.23.013l.962-.038c.248-.01.372-.014.457.057s.102.194.135.44l.132.986c.016.114.023.17.051.22c.028.048.073.083.163.154l.776.61c.192.152.288.227.307.335s-.046.212-.175.42l-.525.847c-.06.097-.09.146-.1.2s.002.111.026.223l.208.978c.052.24.077.36.022.456s-.172.134-.405.21l-.926.301c-.11.036-.165.054-.209.09c-.043.037-.07.089-.123.192l-.452.871c-.115.223-.173.334-.278.372s-.22-.01-.452-.106l-.888-.368c-.109-.045-.163-.068-.22-.068s-.111.023-.22.068l-.888.368c-.232.096-.347.144-.452.106s-.163-.15-.278-.372l-.452-.871c-.054-.103-.08-.155-.123-.191s-.099-.055-.209-.09l-.926-.302c-.233-.076-.35-.114-.405-.21s-.03-.215.022-.456l.208-.978c.024-.112.036-.168.026-.222a.6.6 0 0 0-.1-.2l-.526-.848c-.128-.208-.193-.312-.174-.42s.115-.183.307-.334l.776-.61c.09-.072.135-.107.163-.156s.035-.105.05-.22l.133-.985c.033-.245.05-.369.135-.44s.209-.067.457-.057l.963.038c.117.005.175.007.229-.013c.053-.02.096-.059.182-.138z" />
      <path
        strokeLinecap="round"
        d="M6.5 9h-1m5 0h-1m-3-3h-1m5 0h-1m9 9h-1m1-4h-1"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 8v14h4c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-6c0-1.886 0-2.828-.586-3.414S19.886 8 18 8zm0 0c0-2.828 0-4.243-.879-5.121C12.243 2 10.828 2 8 2s-4.243 0-5.121.879C2 3.757 2 5.172 2 8v3"
      />
    </g>
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.30em"
    height="1.30em"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M12 14c-5 0-8 2.5-8 5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2c0-2.5-3-5-8-5" />
    </g>
  </svg>
);

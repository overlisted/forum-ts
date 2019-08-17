import firebase from "firebase";
import React from 'react';

export type Renderable = React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined
export interface RegisterPageProps { createUser: (email: string, password: string) => Promise<firebase.auth.UserCredential> }
export interface MarkdownFormWithToolsProps { onSubmit: Function }
export interface LoginPageProps { signIn: (email: string, password: string) => Promise<firebase.auth.UserCredential> }
export interface ThreadGenerationProps { threadId: number }
export interface ThreadMessageGenerationProps { messageId: number }
export interface HeaderProps { user: firebase.User | null }
export interface ErrorTextProps { errorCode: string }
export interface AvatarProps { userId: string }
export interface RouteContentProps { url: string }
export interface BoxProps {
  title: string,
  isAsideBox: boolean
}
export interface EventRowProps {
  subject: firebase.User | string,
  predicate: string,
  object: string
}
export interface RouteLinkProps {
  href: string,
  isButton: boolean,
  className?: string
}

export interface NavbarLink {
  displayName: string;
  path: string;
  // TODO
  visibleGroups: string[];
}


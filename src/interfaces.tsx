import firebase from "firebase";

export interface MarkdownFormWithToolsProps { onSubmit: Function }
export interface LoginPageProps { signIn: (email: string, password: string) => Promise<firebase.auth.UserCredential> }
export interface ThreadGenerationProps { threadId: number }
export interface ThreadMessageGenerationProps { messageId: number }
export interface HeaderProps { user: firebase.User | null }
export interface ErrorTextProps { errorCode: string }
export interface AvatarProps { userId: string }
export interface RouteContentProps { url: string }
export interface RouteLinkProps {
  href: string,
  displayName: string,
  isButton: boolean
}

export interface NavbarLink {
  displayName: string;
  path: string;
  // TODO
  visibleGroups: string[];
}


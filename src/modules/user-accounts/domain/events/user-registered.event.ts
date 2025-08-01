export class UserRegisteredEvent {
  constructor(
    public readonly email: string,
    public confirmationCode: string,
    public emailExamples: (code: string) => string
  ) {}
}

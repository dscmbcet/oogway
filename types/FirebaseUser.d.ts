export interface FirebaseUser {
    id: string;
    name: string;
    email: string;
    branch: string;
    year: number;
    college: string;
    discordID: string;
    roles: {
        roleName: string;
        roleID: string;
    }[];
    banned: { status: boolean; reason: string };
    kicked: { status: boolean; reason: string };
    verificationCode: string;
    verified: boolean;
    newUser: boolean;
    verifiedEmail: boolean;
}

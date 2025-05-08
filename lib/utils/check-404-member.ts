const guildId = "1116490275792093276";
const botToken = process.env.DISCORD_BOT_TOKEN;

interface DiscordMemberResponse {
    avatar: string | null;
    banner: string | null;
    communication_disabled_until: Date | null;
    flags: number;
    joined_at: Date;
    nick: string | null;
    pending: boolean;
    premium_since: Date | null;
    roles: string[] | null;
    unusual_dm_activity_until: Date | null;
    user: {
        id: string;
        username: string;
        avatar: string | null;
        discriminator: string;
        public_flag: number;
        flags: number;
        banner: null | string;
        accent_color: number | null;
        global_name: string;
        avatar_decoration_data: null | {
            asset: string;
            sku_id: number;
        };
        collectibles: null | string;
        banner_color: null | string;
        clan: null | string;
        primary_guild: null | string;
    };
    mute: boolean;
    deaf: boolean;
}

export async function getMember404(
    user_id: string
): Promise<DiscordMemberResponse | boolean> {
    const res = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${user_id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!res.ok) {
        if (res.status === 404) {
            return false;
        }
        throw new Error(`Discord API error: ${res.status}`);
    }

    return res.json();
}

export async function getRolesOfUser(user_id: string): Promise<string[]> {
    const member = await getMember404(user_id);
    const roleOfMember: string[] = [];

    if (member === false) {
        roleOfMember.push("USER");
        return roleOfMember;
    }

    if (member && typeof member !== "boolean") {
        if (member.roles) {
            member.roles.forEach((role: string) => {
                if (role === "1156680510463037532") {
                    roleOfMember.push("ADMIN");
                } else if (role === "1157700899179855883") {
                    roleOfMember.push("MEMBER");
                } else {
                    roleOfMember.push("EXTERNE");
                }
            });
        }
    }
    return roleOfMember;
}

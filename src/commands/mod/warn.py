import discord
from discord import app_commands
from discord.ext import commands
from utils.warnings import add_warning, get_warnings, save_warnings, load_warnings
from callbacks.roles.roles import ROLES
import os

INVITE_LINK = os.getenv("INVITE_LINK")

class WarnCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="warn", description="Warn a user")
    @app_commands.describe(member="The member to warn", reason="Reason for warning")
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        count, reasons = add_warning(member.id, reason)
        await interaction.response.send_message(f"{member.mention} has been warned. Total warnings: {count}")

        await interaction.followup.send(f"*smite* {member.mention} {reason}")

        punishments = {}
        raw = os.getenv("PUNISHMENTS", "")
        for item in raw.split(","):
            try:
                warn_count, action = item.split(":")
                punishments[int(warn_count)] = action.lower()
            except ValueError:
                continue

        if count in punishments:
            action = punishments[count]

            if action == "kick":
                await member.kick(reason=f"Reached {count} warnings")
                await interaction.followup.send(f"{member.mention} has been kicked!")
                try:
                    await member.send(f"You were kicked. Rejoin: {INVITE_LINK}")
                except:
                    pass

            elif action == "ban":
                await member.ban(reason=f"Reached {count} warnings")
                await interaction.followup.send(f"{member.mention} has been banned!")

                data = load_warnings()
                user_id = str(member.id)
                if user_id not in data:
                    data[user_id] = {"count": count, "reasons": [reason], "banned": True}
                else:
                    data[user_id]["banned"] = True
                    if "banned_reasons" not in data[user_id]:
                        data[user_id]["banned_reasons"] = []
                    data[user_id]["banned_reasons"].append(reason)
                save_warnings(data)

            elif action.startswith("mute"):
                duration = action.split(":")[1] if ":" in action else None
                mute_role_id = int(ROLES.get("ROLE_TO_MUTE", 0))
                mute_role = discord.utils.get(interaction.guild.roles, id=mute_role_id)
                if mute_role:
                    await member.add_roles(mute_role, reason=f"Muted for reaching {count} warnings")
                    msg = f"{member.mention} has been muted"
                    if duration:
                        msg += f" for {duration}"
                    msg += "!"
                    await interaction.followup.send(msg)

    @app_commands.command(name="warnings", description="Check a user's warnings")
    @app_commands.describe(member="The member to check")
    async def warnings(self, interaction: discord.Interaction, member: discord.Member):
        data = get_warnings(member.id)
        banned_status = "Yes" if data.get("banned") else "No"
        banned_reasons = data.get("banned_reasons", [])
        await interaction.response.send_message(
            f"{member.mention} has {data['count']} warnings. Reasons: {data['reasons']}\n"
            f"Banned: {banned_status}. Ban reasons: {banned_reasons}"
        )

async def setup(bot):
    await bot.add_cog(WarnCommand(bot))

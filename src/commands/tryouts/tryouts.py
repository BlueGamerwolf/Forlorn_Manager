import discord
from discord import app_commands
from discord.ext import commands
from callbacks.roles.roles import ROLES
import os
import json

CLAN_OWNER_ID = 1255287940775678048
OUTPUT_CHANNEL_ID = 1427295052740296827
JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "json", "challenges.json")

def load_challenges():
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r") as f:
            return json.load(f)
    return {}

def save_challenges(data):
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w") as f:
        json.dump(data, f, indent=4)

challenges = load_challenges()

class Tryouts(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="challenge", description="Challenge for a main role")
    @app_commands.describe(role="Role to challenge for")
    async def challenge(self, interaction: discord.Interaction, role: str):
        role_key = role.upper()
        allowed_roles = ["CLAN_LEADER", "CLAN_CO_LEADER", "CLAN_ADMIN", "CLAN_MEMBER"]
        if role_key not in allowed_roles:
            await interaction.response.send_message(f"❌ Invalid role. Choose from: {allowed_roles}", ephemeral=True)
            return

        challenges[str(interaction.user.id)] = {"role": role_key, "status": "pending"}
        save_challenges(challenges)

        clan_owner = await self.bot.fetch_user(CLAN_OWNER_ID)
        try:
            await clan_owner.send(
                f"💡 New challenge request!\n"
                f"User: {interaction.user.mention}\n"
                f"Role: {role_key}\n"
                f"Use /approve {interaction.user.id} or /deny {interaction.user.id} reason"
            )
        except:
            pass

        channel = interaction.guild.get_channel(OUTPUT_CHANNEL_ID)
        if channel:
            await channel.send(f"📢 {interaction.user.mention} has challenged for **{role_key}**!")

        await interaction.response.send_message("✅ Your challenge has been submitted!", ephemeral=True)

    @app_commands.command(name="approve", description="Approve a user's challenge")
    @app_commands.describe(user="User ID of the challenger")
    async def approve(self, interaction: discord.Interaction, user: str):
        if interaction.user.id != CLAN_OWNER_ID:
            await interaction.response.send_message("❌ Only the Clan Owner can approve challenges.", ephemeral=True)
            return

        user_id = str(user)
        if user_id not in challenges:
            await interaction.response.send_message("❌ This user has no pending challenge.", ephemeral=True)
            return

        role_key = challenges[user_id]["role"]
        member = interaction.guild.get_member(int(user_id))
        if not member:
            await interaction.response.send_message("❌ User not found in guild.", ephemeral=True)
            return

        for r in ["CLAN_LEADER", "CLAN_CO_LEADER", "CLAN_ADMIN", "CLAN_MEMBER"]:
            if r != role_key:
                role_obj = interaction.guild.get_role(int(ROLES[r]))
                if role_obj and role_obj in member.roles:
                    await member.remove_roles(role_obj)

        new_role_obj = interaction.guild.get_role(int(ROLES[role_key]))
        if new_role_obj:
            await member.add_roles(new_role_obj)

        passed_role_obj = interaction.guild.get_role(int(ROLES["PASSED_ROLE"]))
        if passed_role_obj:
            await member.add_roles(passed_role_obj)

        challenges[user_id]["status"] = "approved"
        save_challenges(challenges)

        channel = interaction.guild.get_channel(OUTPUT_CHANNEL_ID)
        if channel:
            await channel.send(f"✅ {member.mention} has been approved for **{role_key}**!")

        await interaction.response.send_message(f"{member.mention} approved successfully!", ephemeral=True)

    @app_commands.command(name="deny", description="Deny a user's challenge")
    @app_commands.describe(user="User ID of the challenger", reason="Reason for denial")
    async def deny(self, interaction: discord.Interaction, user: str, reason: str):
        if interaction.user.id != CLAN_OWNER_ID:
            await interaction.response.send_message("❌ Only the Clan Owner can deny challenges.", ephemeral=True)
            return

        user_id = str(user)
        if user_id not in challenges:
            await interaction.response.send_message("❌ This user has no pending challenge.", ephemeral=True)
            return

        member = interaction.guild.get_member(int(user_id))
        if member:
            role_key = challenges[user_id]["role"]
            role_obj = interaction.guild.get_role(int(ROLES.get(role_key, 0)))
            if role_obj and role_obj in member.roles:
                await member.remove_roles(role_obj)

            failed_role_obj = interaction.guild.get_role(int(ROLES["FAILED_ROLE"]))
            if failed_role_obj:
                await member.add_roles(failed_role_obj)

        challenges[user_id]["status"] = "denied"
        save_challenges(challenges)

        channel = interaction.guild.get_channel(OUTPUT_CHANNEL_ID)
        if channel:
            await channel.send(f"❌ {member.mention}'s challenge has been denied. Reason: {reason}")

        await interaction.response.send_message(f"{member.mention} denied successfully!", ephemeral=True)

    @app_commands.command(name="list", description="List all tryouts and their status")
    async def list_tryouts(self, interaction: discord.Interaction):
        if interaction.user.id != CLAN_OWNER_ID:
            await interaction.response.send_message("❌ Only the Clan Owner can view all tryouts.", ephemeral=True)
            return

        if not challenges:
            await interaction.response.send_message("ℹ️ No tryouts found.", ephemeral=True)
            return

        embed = discord.Embed(title="📋 Tryouts Status", color=discord.Color.blue())
        for user_id, data in challenges.items():
            user = await self.bot.fetch_user(int(user_id))
            embed.add_field(
                name=f"{user} ({user_id})",
                value=f"Role: {data['role']}\nStatus: {data['status']}",
                inline=False
            )

        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot):
    await bot.add_cog(Tryouts(bot))

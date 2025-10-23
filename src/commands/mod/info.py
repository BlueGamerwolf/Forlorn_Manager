import discord
from discord import app_commands
from discord.ext import commands
import os

class InfoCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="info", description="Get bot info")
    async def info(self, interaction: discord.Interaction):
        client_id = os.getenv("CLIENT_ID")
        guild_id = os.getenv("GUILD_ID")
        invite = os.getenv("INVITE")

        await interaction.response.send_message(
            f"📋 **Bot Info:**\n"
            f"Client ID: `{client_id}`\n"
            f"Guild ID: `{guild_id}`\n"
            f"Invite: {invite}"
        )

async def setup(bot):
    await bot.add_cog(InfoCommand(bot))

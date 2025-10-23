import discord
from discord import app_commands
from discord.ext import commands
from callbacks.roles.roles import ROLES

class SecretCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="secret", description="Admin-only command")
    async def secret(self, interaction: discord.Interaction):
        admin_role = int(ROLES["CLAN_ADMIN"])
        if any(role.id == admin_role for role in interaction.user.roles):
            await interaction.response.send_message(f"Welcome, Admin ({interaction.user.display_name})")
        else:
            await interaction.response.send_message("You do not have permission to use this command.")

async def setup(bot):
    await bot.add_cog(SecretCommand(bot))

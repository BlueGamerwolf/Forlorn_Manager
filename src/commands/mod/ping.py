import discord
from discord import app_commands
from discord.ext import commands

class PingCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="ping", description="Check if the bot is online")
    async def ping(self, interaction: discord.Interaction):
        await interaction.response.send_message("🏓 Pong! Bot is online.")

async def setup(bot):
    await bot.add_cog(PingCommand(bot))

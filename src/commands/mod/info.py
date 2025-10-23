from discord.ext import commands
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

async def setup(bot):
    @bot.command()
    async def info(ctx):
        client_id = os.getenv("CLIENT_ID")
        guild_id = os.getenv("GUILD_ID")
        invite = os.getenv("INVITE")

        await ctx.send(
            f"📋 **Bot Info:**\n"
            f"Client ID: `{client_id}`\n"
            f"Guild ID: `{guild_id}`\n"
            f"Invite: {invite}"
        )

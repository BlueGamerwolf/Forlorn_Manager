from discord.ext import commands
from callbacks.roles.roles import ROLES

async def setup(bot):
    @bot.command()
    async def secret(ctx):
        admin_role = ROLES["admin"]
        if any(role.id == admin_role for role in ctx.author.roles):
            await ctx.send(f"Welcome, Admin 👑 ({ctx.author.display_name})")
        else:
            await ctx.send("❌ You do not have permission to use this command.")

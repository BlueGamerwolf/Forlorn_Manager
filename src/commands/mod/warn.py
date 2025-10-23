import discord
from discord.ext import commands
from utils.warnings import add_warning, get_warnings
import os

INVITE_LINK = os.getenv("INVITE_LINK")

# Load punishments dynamically from .env
punishments_raw = os.getenv("PUNISHMENTS", "3:smite,5:kick,7:ban")
punishments = {}
for item in punishments_raw.split(","):
    try:
        warn_count, action = item.split(":")
        punishments[int(warn_count)] = action.lower()
    except ValueError:
        continue  # skip invalid entries

class WarnCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.bot.add_listener(self.on_member_unban)

    @commands.command(name="warn")
    @commands.has_permissions(manage_messages=True)
    async def warn(self, ctx, member: discord.Member, *, reason="No reason provided"):
        count, reasons = add_warning(member.id, reason)
        await ctx.send(f"{member.mention} has been warned. Total warnings: {count}")

        # Check punishments dynamically
        if count in punishments:
            action = punishments[count]
            if action == "smite":
                await ctx.send(f"*smite* {member.mention} {reason}")
            elif action == "kick":
                await member.kick(reason="Reached warning limit")
                await ctx.send(f"{member.mention} has been kicked!")
                try:
                    await member.send(f"You were kicked from the server. Rejoin here: {INVITE_LINK}")
                except:
                    pass
            elif action == "ban":
                await member.ban(reason="Reached warning limit")
                await ctx.send(f"{member.mention} has been banned!")

    async def on_member_unban(self, guild, user):
        try:
            await user.send(f"You have been unbanned from {guild.name}. Rejoin here: {INVITE_LINK}")
        except:
            pass

    @commands.command(name="warnings")
    async def warnings(self, ctx, member: discord.Member):
        data = get_warnings(member.id)
        await ctx.send(f"{member.mention} has {data['count']} warnings. Reasons: {data['reasons']}")

async def setup(bot):
    await bot.add_cog(WarnCommand(bot))

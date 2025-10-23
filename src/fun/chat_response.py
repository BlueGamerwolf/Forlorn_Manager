import discord
from discord.ext import commands

class ChatResponse(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        # Ignore the bot's own messages
        if message.author.bot:
            return

        # Check if the bot was mentioned
        if message.mentions and self.bot.user in message.mentions:
            content = message.content.lower()

            # Match phrase
            if "hows python" in content or "how's python" in content:
                await message.reply("Python’s doing great — smoother than Node 😎")
            elif "better than node" in content:
                await message.reply("Of course it is 😏")

# Setup function for cog loading
async def setup(bot):
    await bot.add_cog(ChatResponse(bot))

import os
import asyncio
from dotenv import load_dotenv
import discord
from discord.ext import commands

# Load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

TOKEN = os.getenv("TOKEN")
GUILD_ID = int(os.getenv("GUILD_ID"))  # Make sure it's an integer

if TOKEN is None:
    print("❌ TOKEN not found in .env file!")
else:
    print("✅ TOKEN loaded successfully.")

# Create bot
intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"🤖 Logged in as {bot.user}")

    # Clear old commands for your guild
    guild = discord.Object(id=GUILD_ID)
    await bot.tree.clear_commands(guild=guild)
    await bot.tree.sync(guild=guild)
    print(f"✅ Cleared old slash commands in guild {GUILD_ID}")

# Load extensions
async def load_extensions():
    extensions = [
        "fun.chat_response",
        "commands.mod.warn"
    ]
    for ext in extensions:
        try:
            await bot.load_extension(ext)
            print(f"✅ Loaded {ext}")
        except Exception as e:
            print(f"❌ Failed to load {ext}: {e}")

# Run bot
async def main():
    async with bot:
        await load_extensions()
        await bot.start(TOKEN)

asyncio.run(main())

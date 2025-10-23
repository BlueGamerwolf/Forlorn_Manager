import os
import asyncio
from dotenv import load_dotenv
import discord
from discord.ext import commands

# Load .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

TOKEN = os.getenv("TOKEN")

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

# Load extensions
async def load_extensions():
    try:
        await bot.load_extension("fun.chat_response")
        print("✅ Loaded fun.chat_response")
    except Exception as e:
        print(f"❌ Failed to load fun.chat_response: {e}")

# Run bot
async def main():
    async with bot:
        await load_extensions()
        await bot.start(TOKEN)

asyncio.run(main())

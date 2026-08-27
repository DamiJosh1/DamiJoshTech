with open('server.ts', 'r') as f:
    content = f.read()

# Add fallback for chat
old_chat_catch = """    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }"""

new_chat_catch = """    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        return res.json({ text: "I'm currently receiving too many requests. Please try again in a few minutes, or contact support if this continues." });
    }
    res.status(500).json({ error: 'Failed to generate AI response' });
  }"""

content = content.replace(old_chat_catch, new_chat_catch)

# Add fallback for review summary
old_review_catch = """    res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Gemini Review API Error:', error);
    res.status(500).json({ error: 'Failed to generate review summary due to rate limits or API error.' });
  }"""

new_review_catch = """    res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Gemini Review API Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        return res.json({ summary: "Review summary is temporarily unavailable due to high demand. Please try again later." });
    }
    res.status(500).json({ error: 'Failed to generate review summary due to rate limits or API error.' });
  }"""

content = content.replace(old_review_catch, new_review_catch)

with open('server.ts', 'w') as f:
    f.write(content)
print("Updated server.ts with fallbacks")

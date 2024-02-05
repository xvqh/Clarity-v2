import NewsAPI from "newsapi";
import Discord from "discord.js";

const newsapi = new NewsAPI('0263d89534d144ca9158bda37a3e69e1');

export default {
    name: 'ready',
    run: async (client) => {
        try {
            newsapi.v2.topHeadlines({
                source: 'google-news',
                sortBy: "top",
                language: "fr",
            }).then(data => {
                const articles = data.articles;
                const randomIndex = Math.floor(Math.random() * articles.length);
                const article = articles[randomIndex];
                //     get a log channel
                const channel = client.channels.cache.get(client.data.get(`newschannel_${client.user.id}`));
                if (!channel) return;

                const actuality = new Discord.EmbedBuilder();
                actuality.setTitle(article.title);
                actuality.setURL(article.url);
                if (article.description) { actuality.setDescription(article.description); }
                if (article.image) { actuality.setImage(article.image); }
                actuality.setColor(parseInt(client.color.replace("#", ""), 16))
                actuality.setTimestamp(article.publishedAt)
                actuality.setAuthor({ name: article.author, iconURL: article.author.avatar });
                actuality.setFooter({ text: client.config.footer.text + ` Source: ${article.source.name}` });
                channel.send(actuality);
            })
        } catch (error) {
            console.log(error);
        }
    }
}
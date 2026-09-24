export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Méthode non autorisée"
        });
    }

    try {
        const {
            discord,
            age,
            presentation,
            games,
            known
        } = req.body;

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            return res.status(500).json({
                success: false,
                message: "Webhook Discord non configuré"
            });
        }

        const jeux = Array.isArray(games)
            ? games.join(", ")
            : games || "Aucun jeu indiqué";

        const message = {
            username: "GIDC — Candidatures",
            embeds: [
                {
                    title: "📋 Nouvelle candidature",
                    color: 15158332,
                    fields: [
                        {
                            name: "👤 Pseudo Discord",
                            value: discord || "Non renseigné",
                            inline: true
                        },
                        {
                            name: "🎂 Âge",
                            value: String(age || "Non renseigné"),
                            inline: true
                        },
                        {
                            name: "🎮 Jeux",
                            value: jeux
                        },
                        {
                            name: "🔎 Comment a-t-il connu le GIDC ?",
                            value: known || "Non renseigné"
                        },
                        {
                            name: "📝 Présentation",
                            value: presentation || "Non renseignée"
                        }
                    ],
                    footer: {
                        text: "GIDC — Succès ou rien."
                    }
                }
            ]
        };

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi à Discord");
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Impossible d'envoyer la candidature"
        });
    }
}
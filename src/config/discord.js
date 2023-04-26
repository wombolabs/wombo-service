/* eslint-disable max-len */
export const discord = {
  botToken: process.env.DISCORD_BOT_TOKEN,
  guildWombo: process.env.DISCORD_GUILD_WOMBO,
  messageSubscriptionCreated:
    '¡Muchas gracias por tu compra! Ahora comienza tu entrenamiento en Wombo, prepárate para asistir a clases en vivo y desafiar tus límites para mejorar como jugador.\n\n:one: Ya formas parte de nuestro servidor, ingresa y adquiere el rol de tu juego reaccionando a los íconos del canal <#980848487530889276> para desbloquear todo lo oculto.\n\n:two: Localiza el apartado “Eventos” del servidor situado arriba del  canal <#951188079023116320>. Ahí verás siempre *cuáles son los próximos eventos a los que puedes participar*. Si pulsas sobre “Me interesa” a un evento, te llegará una notificación cuando faltan unos minutos para empezar.\n\n:three: Encuentra los *canales privados de tus coaches.* Dentro de la sección de cada juego, encontrarás los canales:\n- #nombrecoach-chat: para conversar con él y otros subs\n- #nombrecoach-cronograma: aquí están todas las grabaciones de clases pasadas y las fechas de las próximas clases.\n- #nombrecoach-recursos: donde encontrarás archivos útiles.\n\n:four: ¡Participa de la comunidad! Organizamos muchas actividades a la par de las clases en vivo para que *practiques y compitas con otros jugadores.* Revisa la sección de tu juego para encontrar más información de nuestros desafíos: ladder soloq, rankeds pro, aim challenge y scrims.\nTodas las semanas tenemos charlas con expertos de salud, psicología y redes sociales donde aprenderás sobre aspectos que son importantes para ser un jugador completo.\n\n:gift: ¡Y aquí te dejo el regalo para todos nuestros subs! Si quieres tener sesiones privadas 1:1 con tu coach y recibir coaching individual, puedes contactar a <@739617834577166436> para solicitar el cupón de 20% de descuento en sesiones privadas.',
  messageSubscriptionCancelled:
    '*Tu suscripción en Wombo ha sido cancelada correctamente.*\n\nAntes de despedirnos, queremos agradecerte por acompañarnos en este camino de ser mejores. Para nosotros es muy importante la experiencia de los subs y *nos sería de gran ayuda que nos cuentes cómo te ha ido entrenando en Wombo.*\n\nSi quieres darnos tu opinión, puedes enviar un mensaje privado a <@739617834577166436> quienes estarán encantados de tener una conversación contigo.\n\nTe invitamos a seguir participando de los eventos gratuitos de la comunidad y ojalá verte de nuevo en el servidor. :people_hugging:',
  messageSubscriptionTrialEnd:
    'Hola! Espero que estés teniendo una gran experiencia en Wombo, aprendiendo de los mejores entrenadores y divirtiéndote junto al resto de la comunidad :grin:\n\n:hourglass: Te recuerdo que tu prueba gratuita está a punto de finalizar. Para seguir accediendo a las clases de tu entrenador preferido procura tener el saldo suficiente para que el sistema realice el cobro con éxito y puedas seguir disfrutando de todos nuestros beneficios.\n\nPor cualquier duda o consulta, puedes contactar a <@739617834577166436>',
  guildCategories: {
    challenges: process.env.DISCORD_GUILD_CATEGORY_CHALLENGES,
  },
  channelTypes: {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-types
    guildText: 0,
  },
}

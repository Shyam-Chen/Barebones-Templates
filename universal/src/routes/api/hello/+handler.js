export default async (app) => {
  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello
  */
  app.get('', async (req, reply) => {
    return reply.send({
      message: 'Hello, World!',
    });
  });
};

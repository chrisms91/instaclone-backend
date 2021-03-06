require('dotenv').config();
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';

const PORT = process.env.PORT;
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      return {
        loggedInUser: ctx.connection.context.loggedInUser,
      };
    }
  },
  subscriptions: {
    // this goes to the context
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      return {
        loggedInUser: await getUser(token),
      };
    },
  },
});

const app = express();
app.use(logger('tiny'));
apollo.applyMiddleware({ app });
app.use('/static', express.static('uploads'));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apollo.subscriptionsPath}`
  );
});

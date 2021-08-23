import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('TODOapp API')
    .setDescription('')
    .setVersion('0.0.1')
    .build();
  // add security on swagger
  // https://manuel-heidrich.dev/blog/how-to-secure-your-openapi-specification-and-swagger-ui-in-a-nestjs-application/
  app.use(
    ['/swagger', '/swagger.json'],
    basicAuth({
      challenge: true,
      users: {
        admin: 'admin',
      },
    }),
  );

  // change ui swagger stackoverflow
  // to change logo in options
  // .topbar-wrapper img {content:url(\'../assets/img/lbglogo.png\'); width:300px; height:auto;}
  const options = {
    customCss: `
    .topbar-wrapper img {display:none; width:300px; height:auto;}
    .swagger-ui .topbar { background-color: #49cc90; height: 100px;}
    `,
    customSiteTitle: 'TodoAPP',
    customfavIcon: path.resolve(__dirname, '..', 'favicon-32x32.png'),
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, options);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

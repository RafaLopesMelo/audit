FROM public.ecr.aws/lambda/nodejs:22 AS builder

WORKDIR /app
ARG PACKAGE_NAME

COPY . .

RUN npm i -g pnpm && \ 
    pnpm --filter $PACKAGE_NAME install --frozen-lockfile && \
    pnpm --filter $PACKAGE_NAME build;

FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

ARG PACKAGE_NAME

COPY --from=builder /app/packages/serverless/$PACKAGE_NAME/dist/* ./
COPY --from=builder /app/packages/serverless/$PACKAGE_NAME/public/ ./

CMD ["index.handler"]


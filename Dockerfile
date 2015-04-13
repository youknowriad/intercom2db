FROM hwestphal/nodebox

RUN sed -i 's?x86_64/packages/?x86_64/generic/packages/?' /etc/opkg.conf && \
    opkg-cl update && \
    opkg-cl upgrade

ENV NODE_ENV=production

COPY . /app

WORKDIR /app

RUN npm install && \
    npm dedupe && \
    npm cache clean && \
    (rm -rf /tmp/* || true)

ENTRYPOINT ["/app/bin/intercom2db"]
CMD ["/app/config.sample.js"]

.DEFAULT_GOAL := default

IMAGE := docker.cloud.cluster.fun/averagemarcus/cors-proxy:latest

.PHONY: docker-build # Build the docker image
docker-build:
	@docker build -t $(IMAGE) .

.PHONY: publish # Publish the docker image to the Artifactory registry
publish:
	@docker push $(IMAGE)

.PHONY: help # Show this list of commands
help:
	@grep '^.PHONY: .* #' Makefile | sed 's/\.PHONY: \(.*\) # \(.*\)/\1: \2/' | expand -t20

default: docker-build publish


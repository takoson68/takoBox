{
  description = "Node.js API service template";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            nodePackages.pnpm
            nodePackages.nodemon
          ];
          shellHook = ''
            export NODE_ENV=development
            export PORT=${PORT:-3000}
          '';
        };
      }
    );
}

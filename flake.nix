{
  description = "notion hooks setup flake";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: 
    let
      pkgs = nixpkgs.legacyPackages.${system};

      # notion-hooks = pkgs.mkYarnPackage rec {
      #     name = "notion-hooks";
      #     src = ./.;
      #     # configurePhase = "ln -s $node_modules node_modules";
      #     # buildPhase = ''
      #     # '';
      #     # dontInstall = true;
      #     # distPhase = "true";
      #   };
    in {
      devShell = pkgs.mkShell {
        packages = [ 
          pkgs.nodejs-18_x 
          pkgs.yarn
          # notion-hooks
        ];
      };
    });
}

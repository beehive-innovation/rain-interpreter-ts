let
    pkgs = import
        (builtins.fetchTarball {
            name = "nixos-unstable-2022-09-26";
            url = "https://github.com/nixos/nixpkgs/archive/b8e83fd7e16529ee331313993508c3bf918f1d57.tar.gz";
            sha256 = "1a98pgnhdhyg66176i36rcn3rklihy36y9z4176la7pxlzm4khwf";
        })
        { };

    local-test = pkgs.writeShellScriptBin "local-test" ''
        yarn run test
    '';

    flush-all = pkgs.writeShellScriptBin "flush-all" ''
        rm -rf dist
        rm -rf cache
        rm -rf artifacts
        rm -rf contracts
        rm -rf typechain
        rm -rf node_modules
    '';

    ci-test = pkgs.writeShellScriptBin "ci-test" ''
        build-all
        local-test
    '';

    build = pkgs.writeShellScriptBin "build" ''
        copy-contracts
        generate-typechain
        tsc
    '';

    build-all = pkgs.writeShellScriptBin "build-all" ''
        flush-all
        yarn install --ignore-scripts
        build
    '';

    docgen = pkgs.writeShellScriptBin "docgen" ''
        rm -rf ./docs 
        api-extractor run --local 
        api-documenter -i ./ -o ./docs
    '';

    lint = pkgs.writeShellScriptBin "lint" ''
        yarn run lint
    '';

    copy-contracts = pkgs.writeShellScriptBin "copy-contracts" ''
        mkdir -p contracts 
        cp -r node_modules/@beehiveinnovation/rain-protocol/contracts .
        hardhat compile --no-typechain
    '';

    generate-typechain = pkgs.writeShellScriptBin "generate-typechain" ''
        hardhat typechain
        rm -rf src/typechain
        mkdir -p src/typechain
        cp -r typechain src
    '';

    compile = pkgs.writeShellScriptBin "compile" ''
        tsc ''${1}
    '';

    dist = pkgs.writeShellScriptBin "dist" ''
        tsc
    '';

    in
    pkgs.stdenv.mkDerivation {
        name = "shell";
        buildInputs = [
            pkgs.nixpkgs-fmt
            pkgs.yarn
            pkgs.nodejs-16_x
            build
            build-all
            local-test
            ci-test
            flush-all
            docgen
            lint
            copy-contracts
            generate-typechain
            compile
            dist
        ];

        shellHook = ''
            export PATH=$( npm bin ):$PATH
            # keep it fresh
            yarn install --ignore-scripts
            build
        '';
    }

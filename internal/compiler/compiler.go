package main

import (
	"errors"
	"fmt"
	"os/exec"
)

// dream api:
/*
Languages:
	config.**Language
	config.newCliLanguage(
		cmd
		cmdArgs
	)

Config {
	Language interface
	Options option
},

compiler.New(Config)

hand {
	compiler.compile(C_lang, reader, output)
}
*/

type Language string

const (
	C_LANG   Language = "c"
	GO_LANG  Language = "go"
	CPP_LANG Language = "cpp"
)

func SupportedLanguages() []Language {
	return []Language{
		C_LANG,
		CPP_LANG,
		GO_LANG,
	}
}

type LanguageConfig struct {
	name       Language
	compiler   string
	extensions []string
	env        map[string]string
	buildCmd   func(input string, output string) []string
}

var Languages = map[Language]LanguageConfig{
	C_LANG: {
		name:       "C",
		compiler:   "clang",
		extensions: []string{".c"},
		buildCmd: func(input, output string) []string {
			command := []string{}
			command = append(command, input)
			command = append(command, "-o", output)
			return command
		},
	},
	CPP_LANG: {
		name:       "cpp",
		compiler:   "clang++",
		extensions: []string{".cpp", ".cc", ".c++"},
		buildCmd: func(input, output string) []string {
			command := []string{}
			command = append(command, input)
			command = append(command, "-o", output)
			return command
		},
	},
	GO_LANG: {
		name:       "Go",
		compiler:   "go",
		extensions: []string{".go"},
		env:        map[string]string{},
		buildCmd: func(input, output string) []string {
			command := []string{}
			command = append(command, "-o", output)
			command = append(command, input)
			return command
		},
	},
}

func Compile(language Language, filePath string, outputFile string) error {
	languageConfig, found := Languages[language]
	if !found {
		return errors.New("language not suppoted")
	}

	path, err := exec.LookPath(languageConfig.compiler)
	if err != nil {
		return err
	}

	cmd := exec.Command(path, filePath)
	cmd.Args = append(cmd.Args)

	fmt.Println("EXEC:", cmd.String())
	_, err = cmd.Output()

	if err != nil {
		return err
	}

	return nil
}

func main() {
	err := Compile("main.c", "input", "output.wasm")
	if err != nil {
		println(err.Error())
		return
	}

}

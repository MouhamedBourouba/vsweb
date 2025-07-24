package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/mouhamedBourouba/vsweb/internal/compiler"
)

var (
	ErrCantDetectLang   = errors.New("")
	ErrLangNotSupported = errors.New("language specified is not supported. use the list command to get a list of supported compiler.")
)

func main() {
	input := flag.String("input", "", "The file path for source file")
	output := flag.String("output", "", "The file path for output file")
	language := flag.String("language", "", "Specifies the programming language")

	flag.Parse()

	if flag.Arg(0) == "list" {
		fmt.Print(strings.Join(compiler.SupportedLanguages(), "\n"))
		fmt.Println()
		os.Exit(0)
	}

	// TODO: try to get language from file extesion
	if *language == "" {
		fmt.Fprintln(os.Stderr, "Error: unable to deduce the language. please specify it using the -language flag.")
		os.Exit(1)
	}

	detectedLanguage, err := compiler.GetLanguageFromName(*language)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	var inputReader io.Reader

	if *input == "" {
		inputReader = os.Stdin
	} else {
		file, err := os.Open(*input)
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error: Unable Open source file ", *input)
			fmt.Fprintln(os.Stderr, err.Error())
			os.Exit(1)
		}
		defer file.Close()

		inputReader = file
	}

	var outputWriter io.Writer

	if *output == "" {
		outputWriter = os.Stdout
	} else {
		file, err := os.Create(*input)
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error: Unable Create output file ", *output)
			fmt.Println(err.Error())
			os.Exit(1)
		}
		defer file.Close()

		outputWriter = file
	}

	_, err = compiler.Compile(detectedLanguage, inputReader, outputWriter)

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

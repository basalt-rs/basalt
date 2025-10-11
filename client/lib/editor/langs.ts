// imports generated using:
// grep 'export declare const .*' mode/*.d.ts | tr '/ :' '   ' | awk -F' ' 'BEGIN { last="";curr="" } { if (last == "") last = $2; if (last == $2) if (curr == "") curr = $6; else curr = curr ", " $6; else { split(last, arr, "."); print "import { " curr " } from \'@codemirror/legacy-modes/mode/" arr[1] "\';"; curr = $6 }; last = $2 } END { split(last, arr, "."); print "import { " curr " } from \'@codemirror/legacy-modes/mode/" arr[1] "\';"; }'
import { apl } from '@codemirror/legacy-modes/mode/apl';
import { asciiArmor } from '@codemirror/legacy-modes/mode/asciiarmor';
import { asterisk } from '@codemirror/legacy-modes/mode/asterisk';
import { brainfuck } from '@codemirror/legacy-modes/mode/brainfuck';
import {
    c,
    cpp,
    java,
    csharp,
    scala,
    kotlin,
    shader,
    nesC,
    objectiveC,
    objectiveCpp,
    squirrel,
    ceylon,
    dart,
} from '@codemirror/legacy-modes/mode/clike';
import { clojure } from '@codemirror/legacy-modes/mode/clojure';
import { cmake } from '@codemirror/legacy-modes/mode/cmake';
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import { coffeeScript } from '@codemirror/legacy-modes/mode/coffeescript';
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp';
import { crystal } from '@codemirror/legacy-modes/mode/crystal';
import { css, sCSS, less, gss } from '@codemirror/legacy-modes/mode/css';
import { cypher } from '@codemirror/legacy-modes/mode/cypher';
import { d } from '@codemirror/legacy-modes/mode/d';
import { diff } from '@codemirror/legacy-modes/mode/diff';
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile';
import { dtd } from '@codemirror/legacy-modes/mode/dtd';
import { dylan } from '@codemirror/legacy-modes/mode/dylan';
import { ebnf } from '@codemirror/legacy-modes/mode/ebnf';
import { ecl } from '@codemirror/legacy-modes/mode/ecl';
import { eiffel } from '@codemirror/legacy-modes/mode/eiffel';
import { elm } from '@codemirror/legacy-modes/mode/elm';
import { erlang } from '@codemirror/legacy-modes/mode/erlang';
import { factor } from '@codemirror/legacy-modes/mode/factor';
import { fcl } from '@codemirror/legacy-modes/mode/fcl';
import { forth } from '@codemirror/legacy-modes/mode/forth';
import { fortran } from '@codemirror/legacy-modes/mode/fortran';
import { gas, gasArm } from '@codemirror/legacy-modes/mode/gas';
import { gherkin } from '@codemirror/legacy-modes/mode/gherkin';
import { go } from '@codemirror/legacy-modes/mode/go';
import { groovy } from '@codemirror/legacy-modes/mode/groovy';
import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { haxe, hxml } from '@codemirror/legacy-modes/mode/haxe';
import { http } from '@codemirror/legacy-modes/mode/http';
import { idl } from '@codemirror/legacy-modes/mode/idl';
import { javascript, json, jsonld, typescript } from '@codemirror/legacy-modes/mode/javascript';
import { jinja2 } from '@codemirror/legacy-modes/mode/jinja2';
import { julia } from '@codemirror/legacy-modes/mode/julia';
import { liveScript } from '@codemirror/legacy-modes/mode/livescript';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { mathematica } from '@codemirror/legacy-modes/mode/mathematica';
import { mbox } from '@codemirror/legacy-modes/mode/mbox';
import { mirc } from '@codemirror/legacy-modes/mode/mirc';
import { oCaml, fSharp, sml } from '@codemirror/legacy-modes/mode/mllike';
import { modelica } from '@codemirror/legacy-modes/mode/modelica';
import { mscgen, msgenny, xu } from '@codemirror/legacy-modes/mode/mscgen';
import { mumps } from '@codemirror/legacy-modes/mode/mumps';
import { nginx } from '@codemirror/legacy-modes/mode/nginx';
import { nsis } from '@codemirror/legacy-modes/mode/nsis';
import { ntriples } from '@codemirror/legacy-modes/mode/ntriples';
import { octave } from '@codemirror/legacy-modes/mode/octave';
import { oz } from '@codemirror/legacy-modes/mode/oz';
import { pascal } from '@codemirror/legacy-modes/mode/pascal';
import { pegjs } from '@codemirror/legacy-modes/mode/pegjs';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { pig } from '@codemirror/legacy-modes/mode/pig';
import { powerShell } from '@codemirror/legacy-modes/mode/powershell';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { protobuf } from '@codemirror/legacy-modes/mode/protobuf';
import { pug } from '@codemirror/legacy-modes/mode/pug';
import { puppet } from '@codemirror/legacy-modes/mode/puppet';
import { python, cython } from '@codemirror/legacy-modes/mode/python';
import { q } from '@codemirror/legacy-modes/mode/q';
import { r } from '@codemirror/legacy-modes/mode/r';
import { rpmChanges, rpmSpec } from '@codemirror/legacy-modes/mode/rpm';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { rust } from '@codemirror/legacy-modes/mode/rust';
import { sas } from '@codemirror/legacy-modes/mode/sas';
import { sass } from '@codemirror/legacy-modes/mode/sass';
import { scheme } from '@codemirror/legacy-modes/mode/scheme';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { sieve } from '@codemirror/legacy-modes/mode/sieve';
import { smalltalk } from '@codemirror/legacy-modes/mode/smalltalk';
import { solr } from '@codemirror/legacy-modes/mode/solr';
import { sparql } from '@codemirror/legacy-modes/mode/sparql';
import { spreadsheet } from '@codemirror/legacy-modes/mode/spreadsheet';
import {
    standardSQL,
    msSQL,
    mySQL,
    mariaDB,
    sqlite,
    cassandra,
    plSQL,
    hive,
    pgSQL,
    gql,
    gpSQL,
    sparkSQL,
    esper,
} from '@codemirror/legacy-modes/mode/sql';
import { stex, stexMath } from '@codemirror/legacy-modes/mode/stex';
import { stylus } from '@codemirror/legacy-modes/mode/stylus';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { tcl } from '@codemirror/legacy-modes/mode/tcl';
import { textile } from '@codemirror/legacy-modes/mode/textile';
import { tiddlyWiki } from '@codemirror/legacy-modes/mode/tiddlywiki';
import { tiki } from '@codemirror/legacy-modes/mode/tiki';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { troff } from '@codemirror/legacy-modes/mode/troff';
import { ttcnCfg } from '@codemirror/legacy-modes/mode/ttcn-cfg';
import { ttcn } from '@codemirror/legacy-modes/mode/ttcn';
import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { vb } from '@codemirror/legacy-modes/mode/vb';
import { vbScript, vbScriptASP } from '@codemirror/legacy-modes/mode/vbscript';
import { velocity } from '@codemirror/legacy-modes/mode/velocity';
import { verilog, tlv } from '@codemirror/legacy-modes/mode/verilog';
import { vhdl } from '@codemirror/legacy-modes/mode/vhdl';
import { wast } from '@codemirror/legacy-modes/mode/wast';
import { webIDL } from '@codemirror/legacy-modes/mode/webidl';
import { xml, html } from '@codemirror/legacy-modes/mode/xml';
import { xQuery } from '@codemirror/legacy-modes/mode/xquery';
import { yacas } from '@codemirror/legacy-modes/mode/yacas';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { z80, ez80 } from '@codemirror/legacy-modes/mode/z80';

// Exports generated with:
// grep 'export declare const .*' mode/*.d.ts | tr '/ :' '   ' | awk -F' ' 'BEGIN { print "const langs: Record<string, StreamParser<unknown>> = {" } { print "    " $6 ","; if (tolower($6) != $6) print "    " tolower($6)": "$6"," } END { print "\n};\nexport default langs;" }'
const langs = {
    apl,
    asciiArmor,
    asciiarmor: asciiArmor,
    asterisk,
    brainfuck,
    c,
    cpp,
    java,
    csharp,
    scala,
    kotlin,
    shader,
    nesC,
    nesc: nesC,
    objectiveC,
    objectivec: objectiveC,
    objectiveCpp,
    objectivecpp: objectiveCpp,
    squirrel,
    ceylon,
    dart,
    clojure,
    cmake,
    cobol,
    coffeeScript,
    coffeescript: coffeeScript,
    commonLisp,
    commonlisp: commonLisp,
    crystal,
    css,
    sCSS,
    scss: sCSS,
    less,
    gss,
    cypher,
    d,
    diff,
    dockerFile,
    dockerfile: dockerFile,
    dtd,
    dylan,
    ebnf,
    ecl,
    eiffel,
    elm,
    erlang,
    factor,
    fcl,
    forth,
    fortran,
    gas,
    gasArm,
    gasarm: gasArm,
    gherkin,
    go,
    groovy,
    haskell,
    haxe,
    hxml,
    http,
    idl,
    javascript,
    json,
    jsonld,
    typescript,
    jinja2,
    julia,
    liveScript,
    livescript: liveScript,
    lua,
    mathematica,
    mbox,
    mirc,
    oCaml,
    ocaml: oCaml,
    fSharp,
    fsharp: fSharp,
    sml,
    modelica,
    mscgen,
    msgenny,
    xu,
    mumps,
    nginx,
    nsis,
    ntriples,
    octave,
    oz,
    pascal,
    pegjs,
    perl,
    pig,
    powerShell,
    powershell: powerShell,
    properties,
    protobuf,
    pug,
    puppet,
    python,
    cython,
    q,
    r,
    rpmChanges,
    rpmchanges: rpmChanges,
    rpmSpec,
    rpmspec: rpmSpec,
    ruby,
    rust,
    sas,
    sass,
    scheme,
    shell,
    sieve,
    smalltalk,
    solr,
    sparql,
    spreadsheet,
    standardSQL,
    standardsql: standardSQL,
    msSQL,
    mssql: msSQL,
    mySQL,
    mysql: mySQL,
    mariaDB,
    mariadb: mariaDB,
    sqlite,
    cassandra,
    plSQL,
    plsql: plSQL,
    hive,
    pgSQL,
    pgsql: pgSQL,
    gql,
    gpSQL,
    gpsql: gpSQL,
    sparkSQL,
    sparksql: sparkSQL,
    esper,
    stex,
    stexMath,
    stexmath: stexMath,
    stylus,
    swift,
    tcl,
    textile,
    tiddlyWiki,
    tiddlywiki: tiddlyWiki,
    tiki,
    toml,
    troff,
    ttcnCfg,
    ttcncfg: ttcnCfg,
    ttcn,
    turtle,
    vb,
    vbScript,
    vbscript: vbScript,
    vbScriptASP,
    vbscriptasp: vbScriptASP,
    velocity,
    verilog,
    tlv,
    vhdl,
    wast,
    webIDL,
    webidl: webIDL,
    xml,
    html,
    xQuery,
    xquery: xQuery,
    yacas,
    yaml,
    z80,
    ez80,
};
export default langs;

export type LanguageSyntax = keyof typeof langs;

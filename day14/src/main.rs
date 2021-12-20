const RAW: &str = "OHFNNCKCVOBHSSHONBNF

SV -> O
KP -> H
FP -> B
VP -> V
KN -> S
KS -> O
SB -> K
BS -> K
OF -> O
ON -> S
VS -> F
CK -> C
FB -> K
CH -> K
HS -> H
PO -> F
NP -> N
FH -> C
FO -> O
FF -> C
CO -> K
NB -> V
PP -> S
BB -> N
HH -> B
KK -> H
OP -> K
OS -> V
KV -> F
VH -> F
OB -> S
CN -> H
SF -> K
SN -> P
NF -> H
HB -> V
VC -> S
PS -> P
NK -> B
CV -> P
BC -> S
NH -> K
FN -> P
SH -> F
FK -> P
CS -> O
VV -> H
OC -> F
CC -> N
HK -> N
FS -> P
VF -> B
SS -> V
PV -> V
BF -> V
OV -> C
HO -> F
NC -> F
BN -> F
HC -> N
KO -> P
KH -> F
BV -> S
SK -> F
SC -> F
VN -> V
VB -> V
BH -> O
CP -> K
PK -> K
PB -> K
FV -> S
HN -> K
PH -> B
VK -> B
PC -> H
BO -> H
SP -> V
NS -> B
OH -> N
KC -> H
HV -> F
HF -> B
HP -> S
CB -> P
PN -> S
BK -> K
PF -> N
SO -> P
CF -> B
VO -> C
OO -> K
FC -> F
NV -> F
OK -> K
NN -> O
NO -> O
BP -> O
KB -> O
KF -> O";

const CHUNK_SIZE: usize = 99999999;
const STEPS: u8 = 21;

use std::collections::HashMap;
use std::cmp;
use std::time::SystemTime;

fn main() {
    println!("Hello, world!");
    let now = SystemTime::now();
    
    let lines: Vec<&str> = RAW.split('\n').collect();
    let polymer_template = lines[0];
    let rules_raw = &lines[2..];
    
    // let mut el_count = 0;
    // let mut element_ids: HashMap<&str, u8> = HashMap::new();
    
    // let init_polymer = polymer_template.as_bytes();
    
    let mut el_count_map: HashMap<u8, u128> = HashMap::new();
    
    for (i, el) in polymer_template.bytes().enumerate() {
        el_count_map.insert(el, if i == 0 { 1 } else { 0 });
    }
    
    let rules: HashMap<&str, char> = rules_raw.iter().fold(
        HashMap::new(),
        |mut acc, &raw_rule| {
            let key = &raw_rule[0..2];
            let ins = raw_rule.chars().last().unwrap();
            acc.insert(key, ins);
            el_count_map.insert(ins as u8, 0);
            acc
        }
    );
    
    process_chunk(&String::from(polymer_template), 0, &rules, &mut el_count_map);
    
    println!("{:#?}", el_count_map);
    
    let mut min: u128 = u128::MAX;
    let mut max: u128 = 0;
    
    for (_key, value) in el_count_map {
        if value > 0 {
            min = cmp::min(min, value);
            max = cmp::max(max, value);
        }
    }
    
    let diff = max - min;
    println!("{} steps", STEPS);
    println!("{}", diff);
    println!("{:#?}", now.elapsed().unwrap());
}

fn process_chunk(chunk: &String, step: u8, rules: &HashMap<&str, char>, el_count_map: &mut HashMap<u8, u128>) {
    if step == STEPS {
        for el in chunk.bytes().skip(1) {
            if el == 78 || el == 70 {
                let el_count: u128 = el_count_map[&el];
                el_count_map.insert(el, el_count + 1);
            }
        }
        return;
    }
    
    let mut new_chunk = String::with_capacity(CHUNK_SIZE);
    new_chunk.push(chunk.chars().next().unwrap());
    
    let end = chunk.len() - 1;
    for i in 0..end {
        let pair = &chunk[i..i+2];
        let insertion = rules[pair];
        
        if new_chunk.len() >= new_chunk.capacity() - 2 {
            // println!("splitting chunk");
            process_chunk(&new_chunk, step + 1, rules, el_count_map);
            new_chunk.clear();
            new_chunk.push(pair.chars().nth(0).unwrap());
        }
        
        new_chunk.push(insertion);
        new_chunk.push(pair.chars().nth(1).unwrap());
    }
    
    process_chunk(&new_chunk, step + 1, rules, el_count_map);
}

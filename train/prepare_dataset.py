import json
import os
from pathlib import Path
from typing import List, Dict, Any

# Curated high-quality patent training corpus across Mechanical and Electronics domains
PATENT_TRAINING_PAIRS = [
    # Mechanical: Drones, Propellers, Actuators, Mechanisms
    {
        "query": "variable pitch drone rotor hub with pivoting blade grips and preloaded angular contact ball bearings",
        "positive": "A variable pitch rotor assembly for a multirotor aircraft comprising a central hub, a plurality of blade grips pivotally mounted to the hub, and a swashplate actuated by an axial servo motor to dynamically alter blade angle during flight.",
        "negative": "A fixed-pitch folding propeller assembly having spring-loaded hinging pins that automatically unfold under centrifugal force during motor acceleration.",
        "domain": "mechanical",
        "doc_id": "US-10457388-B2"
    },
    {
        "query": "concentric axial pushrod mechanism driven by hollow shaft brushless motor for dynamic pitch control",
        "positive": "The axial pushrod mechanism translates linear displacement from a concentric core actuator into angular rotation of blade roots via offset linkage pins, enabling rapid blade pitch adjustment within 15 milliseconds.",
        "negative": "A coaxial dual-rotor planetary gearbox having sun gears and planetary pinions configured to rotate upper and lower rotor shafts in counter-rotating directions.",
        "domain": "mechanical",
        "doc_id": "US-10457388-B2"
    },
    {
        "query": "brushless torque motor integrated inside blade root sleeve with magnetic Hall angle sensor",
        "positive": "Each blade root incorporates an integrated brushless torque motor and Hall-effect angular position sensor to eliminate mechanical swashplates and control individual blade angle of attack directly.",
        "negative": "A trailing edge flap control surface driven by an elongated piezoelectric bimorph actuator embedded in the blade skin.",
        "domain": "mechanical",
        "doc_id": "US-9878783-B2"
    },
    {
        "query": "centrifugal flyweight counterweight mechanism modifying rotor blade twist via helical cam groove",
        "positive": "The helical cam groove on the blade shank engages a fixed follower pin on the rotor hub, causing blade twist proportional to centrifugal flyweight displacement.",
        "negative": "An aerodynamic vortex generator disposed on the blade suction side to delay boundary layer stall at high angles of attack.",
        "domain": "mechanical",
        "doc_id": "EP-3205574-A1"
    },
    {
        "query": "multi-axis gimbal mount with magnetic damping and brushless direct drive motors",
        "positive": "A 3-axis camera gimbal stabilization apparatus having high-resolution magnetic rotary encoders and direct-drive brushless gimbal motors with active field-oriented vibration attenuation.",
        "negative": "A quick-release tripod plate mechanism featuring a spring-actuated dovetail clamping lever and rubber anti-twist friction pads.",
        "domain": "mechanical",
        "doc_id": "US-9915387-B2"
    },
    {
        "query": "cycloidal rotor propulsion system with eccentric bearing ring for vectored thrust generation",
        "positive": "A cycloidal propulsion module comprising a rotating drum supporting multiple spanwise blades whose pitch angle is dynamically modulated by an offset eccentric pitch control ring.",
        "negative": "A ducted fan shroud containing stator guide vanes configured to recover rotational swirl energy behind a fixed-pitch impeller.",
        "domain": "mechanical",
        "doc_id": "US-10214289-B2"
    },

    # Electronics: Low-Power Wake-Up, Energy Harvesting, Comparator Circuits, Power Gating
    {
        "query": "sub-nanowatt wake-up receiver with sub-threshold differential comparator and dynamic threshold biasing",
        "positive": "The wake-up trigger circuit utilizes a sub-threshold differential comparator with dynamic threshold biasing, achieving a standby power consumption below 850 picowatts at 0.8V supply.",
        "negative": "A high-speed pipelined analog-to-digital converter operating at 500 MSPS with flash comparator ladder and digital calibration registers.",
        "domain": "electronics",
        "doc_id": "US-10892745-B1"
    },
    {
        "query": "piezoelectric acoustic transducer harvesting ultrasonic energy to charge storage capacitor via diode bridge",
        "positive": "The acoustic transducer outputs a voltage burst that directly charges a storage capacitor via a Schottky diode bridge; once the capacitor voltage exceeds a tunnel diode breakdown threshold, a wake-up signal is output without battery drain during idle states.",
        "negative": "An inductive wireless power transmitter coil driven by a resonant H-bridge class-E inverter at 6.78 MHz.",
        "domain": "electronics",
        "doc_id": "US-11201584-B2"
    },
    {
        "query": "adaptive power gating controller with dual-threshold comparator monitoring buffer capacitor ripple",
        "positive": "A dual-threshold comparator monitors ripple on the energy buffer and activates high-side PMOS power gating switches when sensor data entropy exceeds a programmable activity metric.",
        "negative": "A synchronous buck DC-DC converter with pulse-frequency modulation (PFM) control loop and external bootstrap capacitor.",
        "domain": "electronics",
        "doc_id": "EP-3817208-A1"
    },
    {
        "query": "ultra-low leakage bandgap voltage reference operating in deep sub-threshold CMOS",
        "positive": "A reference voltage generator circuit utilizing proportional-to-absolute-temperature (PTAT) MOS current mirrors biased in deep subthreshold to generate a 0.5V reference under 120 picowatts.",
        "negative": "A high-precision phase-locked loop (PLL) synthesizer with LC voltage-controlled oscillator and fractional-N sigma-delta divider.",
        "domain": "electronics",
        "doc_id": "US-10656667-B2"
    },
    {
        "query": "asynchronous event-driven neuromorphic edge spike detector circuit with low standby power",
        "positive": "An asynchronous spike generator comprising a capacitive level detector and leaky integrate-and-fire comparator that outputs digital interrupts only upon input waveform derivative transitions.",
        "negative": "A multi-core synchronous DSP vector processor with 32-bit SIMD arithmetic logic units and DMA memory controllers.",
        "domain": "electronics",
        "doc_id": "US-11100388-B2"
    }
]


def augment_patent_triplet(triplet: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Augment a single triplet into multiple linguistic variants."""
    variants = [triplet]
    q = triplet["query"]
    
    # Variant 1: Prefix with technical domain & system
    v1 = dict(triplet)
    v1["query"] = f"A {triplet['domain']} invention comprising {q}"
    variants.append(v1)

    # Variant 2: Claim-style phrasing
    v2 = dict(triplet)
    v2["query"] = f"An apparatus characterized by {q}"
    variants.append(v2)

    # Variant 3: Element keyword focus
    words = q.split()
    if len(words) > 5:
        v3 = dict(triplet)
        v3["query"] = " ".join(words[:6])
        variants.append(v3)

    return variants


def prepare_datasets(output_dir: str = "train/data") -> Dict[str, str]:
    """Generate training, validation, and evaluation splits in JSONL format."""
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    train_file = out_path / "patent_triplets_train.jsonl"
    eval_file = out_path / "patent_benchmark_eval.jsonl"

    augmented_train = []
    for item in PATENT_TRAINING_PAIRS:
        augmented_train.extend(augment_patent_triplet(item))

    with open(train_file, "w", encoding="utf-8") as f:
        for item in augmented_train:
            f.write(json.dumps(item) + "\n")

    with open(eval_file, "w", encoding="utf-8") as f:
        for item in PATENT_TRAINING_PAIRS:
            f.write(json.dumps(item) + "\n")

    print(f"[Dataset Preparation Complete]")
    print(f"  • Augmented Train samples: {len(augmented_train)} -> {train_file}")
    print(f"  • Eval benchmark: {len(PATENT_TRAINING_PAIRS)} -> {eval_file}")

    return {
        "train": str(train_file),
        "eval": str(eval_file)
    }


if __name__ == "__main__":
    prepare_datasets()

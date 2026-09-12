from typing import List, Optional
from connectors.base import BasePatentConnector
from schemas.retrieval import PriorArtCandidate

CURATED_PATENT_DATABASE = [
    # Mechanical: Drone / Propeller / Pitch Mechanism / Actuators
    {
        "doc_id": "US-10457388-B2",
        "title": "Variable Pitch Propeller Mechanism for Multirotor Unmanned Aerial Vehicles",
        "abstract": "A variable pitch rotor assembly for a multirotor aircraft comprising a central hub, a plurality of blade grips pivotally mounted to the hub, and a swashplate actuated by an axial servo motor to dynamically alter blade angle during flight.",
        "relevant_passage": "The axial pushrod mechanism translates linear displacement from a concentric core actuator into angular rotation of blade roots via offset linkage pins, enabling rapid blade pitch adjustment within 15 milliseconds.",
        "ipc_cpc_classes": ["B64C 11/00", "B64C 27/605", "B64U 10/14"],
        "publication_date": "2019-10-29",
        "url": "https://patents.google.com/patent/US10457388B2/en",
        "domain": "mechanical",
        "keywords": ["variable pitch", "propeller", "drone", "uav", "blade", "swashplate", "actuator", "linkage"]
    },
    {
        "doc_id": "US-9878783-B2",
        "title": "Individual Blade Pitch Control System for Compact Rotorcraft",
        "abstract": "An independent blade pitch control apparatus for small unmanned aerial systems utilizing magnetic rotary encoders and micro-stepper motors embedded directly within the blade retention sleeve.",
        "relevant_passage": "Each blade root incorporates an integrated brushless torque motor and Hall-effect angular position sensor to eliminate mechanical swashplates and control individual blade angle of attack directly.",
        "ipc_cpc_classes": ["B64C 27/72", "B64C 11/06", "H02K 7/14"],
        "publication_date": "2018-01-30",
        "url": "https://patents.google.com/patent/US9878783B2/en",
        "domain": "mechanical",
        "keywords": ["pitch control", "stepper motor", "brushless", "blade root", "magnetic encoder", "swashplateless"]
    },
    {
        "doc_id": "EP-3205574-A1",
        "title": "Centrifugal Pitch-Biased Rotor Hub Assembly",
        "abstract": "A mechanical rotor hub configured with counterweights that automatically modify blade pitch as rotational speed changes, providing passive aerodynamic stabilization.",
        "relevant_passage": "The helical cam groove on the blade shank engages a fixed follower pin on the rotor hub, causing blade twist proportional to centrifugal flyweight displacement.",
        "ipc_cpc_classes": ["B64C 11/08", "F03D 7/02"],
        "publication_date": "2017-08-16",
        "url": "https://worldwide.espacenet.com/patent/search/family/en/publication/EP3205574A1",
        "domain": "mechanical",
        "keywords": ["centrifugal", "pitch", "rotor hub", "cam groove", "passive", "flyweight", "aerodynamic"]
    },
    # Electronics: Low-Power Wake-Up / Energy Harvesting / Comparators
    {
        "doc_id": "US-10892745-B1",
        "title": "Sub-Nanowatt Wake-Up Receiver Circuit for Wireless Sensor Nodes",
        "abstract": "An ultra-low power envelope detector and asynchronous event-driven wake-up receiver operating in sub-threshold CMOS regime to minimize quiescent leakage current.",
        "relevant_passage": "The wake-up trigger circuit utilizes a sub-threshold differential comparator with dynamic threshold biasing, achieving a standby power consumption below 850 picowatts at 0.8V supply.",
        "ipc_cpc_classes": ["H03K 17/94", "H04W 52/02", "G08C 17/02"],
        "publication_date": "2021-01-12",
        "url": "https://patents.google.com/patent/US10892745B1/en",
        "domain": "electronics",
        "keywords": ["wake-up", "receiver", "sub-threshold", "nanowatt", "comparator", "quiescent", "leakage", "sensor node"]
    },
    {
        "doc_id": "US-11201584-B2",
        "title": "Zero-Power Acoustic Event Detector and Threshold Trigger System",
        "abstract": "A piezoelectric acoustic sensor coupled with a passive rectifier circuit that harvests energy directly from incident acoustic waves to trip a low-power digital interrupt.",
        "relevant_passage": "The acoustic transducer outputs a voltage burst that directly charges a storage capacitor via a Schottky diode bridge; once the capacitor voltage exceeds a tunnel diode breakdown threshold, a wake-up signal is output without battery drain during idle states.",
        "ipc_cpc_classes": ["H03K 3/023", "G01V 1/18", "H02N 2/18"],
        "publication_date": "2021-12-14",
        "url": "https://patents.google.com/patent/US11201584B2/en",
        "domain": "electronics",
        "keywords": ["piezoelectric", "acoustic", "zero-power", "energy harvesting", "rectifier", "interrupt", "threshold"]
    },
    {
        "doc_id": "EP-3817208-A1",
        "title": "Adaptive Power-Gating Controller for Edge Machine Learning Accelerators",
        "abstract": "A microcontroller power management architecture having multi-rail voltage switches and predictive sleep duration timing.",
        "relevant_passage": "A dual-threshold comparator monitors ripple on the energy buffer and activates high-side PMOS power gating switches when sensor data entropy exceeds a programmable activity metric.",
        "ipc_cpc_classes": ["G06F 1/32", "H03K 19/003"],
        "publication_date": "2021-05-05",
        "url": "https://worldwide.espacenet.com/patent/search/family/en/publication/EP3817208A1",
        "domain": "electronics",
        "keywords": ["power gating", "comparator", "microcontroller", "sleep", "activity metric", "energy buffer"]
    }
]


class MockPatentIndexConnector(BasePatentConnector):
    """Deterministic local patent and literature index connector."""

    @property
    def source_name(self) -> str:
        return "mock_patent_index"

    def search(
        self,
        query: str,
        limit: int = 5,
        ipc_classes: Optional[List[str]] = None
    ) -> List[PriorArtCandidate]:
        query_terms = set(query.lower().replace(",", " ").replace("-", " ").split())
        scored_docs = []

        for item in CURATED_PATENT_DATABASE:
            score = 0.0
            doc_text = (
                item["title"] + " " + item["abstract"] + " " + item["relevant_passage"] + " " + " ".join(item["keywords"])
            ).lower()
            
            # Term matching with prefix/stem support
            for term in query_terms:
                if len(term) >= 3:
                    if term in doc_text:
                        score += 2.0
                    elif any(term[:4] in w for w in doc_text.split() if len(term) >= 4):
                        score += 1.0

            # IPC/CPC class overlap boost
            if ipc_classes:
                for c in ipc_classes:
                    if any(c.lower() in doc_c.lower() for doc_c in item["ipc_cpc_classes"]):
                        score += 3.0

            if score > 0.0:
                candidate = PriorArtCandidate(
                    doc_id=item["doc_id"],
                    title=item["title"],
                    abstract=item["abstract"],
                    relevant_passage=item["relevant_passage"],
                    source="mock_patent_index",
                    publication_date=item["publication_date"],
                    url=item["url"],
                    ipc_cpc_classes=item["ipc_cpc_classes"],
                    similarity_score=min(1.0, score / max(1.0, float(len(query_terms))))
                )
                scored_docs.append((score, candidate))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored_docs[:limit]]

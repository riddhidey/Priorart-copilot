from schemas.disclosure import InventionDisclosure
from agents.disclosure_parser import DisclosureParserAgent
from agents.retrieval_agent import RetrievalAgent
from agents.novelty_clustering import NoveltyClusteringAgent
from agents.report_writer import ReportWriterAgent
from connectors.mock_index import MockPatentIndexConnector


def test_disclosure_parser_agent():
    disclosure = InventionDisclosure(
        title="High-Efficiency Drone Pitch Actuator",
        raw_text="1. Pitch Rotor Hub: A carbon fiber rotor hub holding 4 blades.\n2. Axial Stepper Actuator: Linear pushrod actuated by central stepper motor.",
        technical_domain="mechanical"
    )
    agent = DisclosureParserAgent()
    parsed = agent.parse(disclosure)
    assert parsed.title == disclosure.title
    assert len(parsed.claim_elements) >= 2
    assert parsed.claim_elements[0].element_id == "elem_01"


def test_retrieval_agent_element_separation():
    disclosure = InventionDisclosure(
        title="Drone Pitch Mechanism",
        raw_text="1. Variable Pitch Rotor Hub: Multi-blade drone rotor hub.\n2. Acoustic Sensor Trigger: Piezoelectric acoustic wake-up circuit.",
        technical_domain="mechanical"
    )
    parser = DisclosureParserAgent()
    parsed = parser.parse(disclosure)

    retrieval_agent = RetrievalAgent(connectors=[MockPatentIndexConnector()])
    retrieval_output = retrieval_agent.retrieve(parsed, top_k_per_element=3)

    assert len(retrieval_output.element_results) == len(parsed.claim_elements)
    assert retrieval_output.total_candidates > 0


def test_novelty_clustering_and_report_writer():
    disclosure = InventionDisclosure(
        title="Drone Pitch Mechanism",
        raw_text="1. Variable Pitch Blade Rotor Hub: Multirotor drone propeller hub with pitch adjustment linkage.",
        technical_domain="mechanical"
    )
    parser = DisclosureParserAgent()
    parsed = parser.parse(disclosure)

    retrieval_agent = RetrievalAgent(connectors=[MockPatentIndexConnector()])
    retrieval_output = retrieval_agent.retrieve(parsed, top_k_per_element=3)

    clustering_agent = NoveltyClusteringAgent()
    clustering_output = clustering_agent.cluster_and_score(parsed, retrieval_output)

    assert clustering_output.overall_invention_risk in ["high", "moderate", "low"]

    report_agent = ReportWriterAgent()
    report = report_agent.generate_report(parsed, retrieval_output, clustering_output)

    assert report.disclaimer is not None
    assert len(report.element_sections) == 1
